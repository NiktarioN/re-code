import { scheduleJobAfter, scheduleJobAsap } from '@app/jobs';
import { createDeal } from '@getcourse/sdk';
import { get } from '@app/request';

const CONFIG = {
  FUNNEL_ID: 19633,
  FUNNEL_STAGE_ID: 191250,
  OFFER_ID: 6673218,
  OFFER_TAGS: ['событие_ЛИД-ФЛОКТОРИ'],
  DEFAULT_COMMENT: 'Заказ создан для обработки ОП от проекта Flocktory',
  UTM_SOURCE: 'flocktory',
  FUID: '220365610',
  API_TOKEN: 'zl0j36f5co2724e8v7qq8bjh541f7qdo',
  SITE_ID: '5942',
  API_URL: 'https://client.flocktory.com/v2/exchange/phone-leads',
};

const toUrlSearchParams = (obj) => new URLSearchParams(obj).toString();

const getPrize = (campaignId) => {
  const prizes = {
    938527: 'Скидка до 50 000 рублей',
  };
  return prizes[campaignId] || 'Скидка до 50 000 рублей';
};

const getLeads = async (from, to, ctx) => {
  const params = {
    token: CONFIG.API_TOKEN,
    site_id: CONFIG.SITE_ID,
    from,
    to,
    add_fields: 'campaign_id',
  };

  const queryString = toUrlSearchParams(params);
  const url = `${CONFIG.API_URL}?${queryString}`;
  ctx.account.log('Fetch url', { json: { url } });

  return get(url);
};

const addLeads = async (ctx, leads) => {
  if (!Array.isArray(leads)) {
    ctx.account.log('Flocktory. Invalid data format for leads', { json: { leads } });
    return;
  }

  ctx.account.log('Flocktory. New leads', { json: { count: leads.length, data: leads } });

  const leadPromises = leads.map(async (data) => {
    try {
      const { name = '', email: userEmail, phone: userPhone, campaign_id: campaignId } = data;
      const [firstName = undefined, lastName = undefined] = name.trim().split(/\s+/);

      ctx.account.log('Flocktory. New lead info', { json: { name, userEmail, userPhone, campaignId } });

      const result = await createDeal(ctx, {
        user: { email: userEmail, phone: userPhone, first_name: firstName, last_name: lastName },
        system: { refresh_if_exists: 0 },
        session: { utm_source: CONFIG.UTM_SOURCE },
        deal: {
          deal_status: 'new',
          offers: [{ offer_id: CONFIG.OFFER_ID }],
          addtags: CONFIG.OFFER_TAGS,
          disable_notifications: true,
          deal_comment: CONFIG.DEFAULT_COMMENT,
          funnel_id: CONFIG.FUNNEL_ID,
          funnel_stage_id: CONFIG.FUNNEL_STAGE_ID,
          addfields: {
            utm_source: CONFIG.UTM_SOURCE,
            fuid: CONFIG.FUID,
            ['Выигрыш']: getPrize(campaignId),
          },
        },
      });
      ctx.account.log(`Flocktory. Result of create deal ${userEmail}`, { json: { result } });
    } catch (error) {
      ctx.account.log('Flocktory. Error creating deal', { json: { error, data } });
    }
  });

  await Promise.all(leadPromises);
};

const periodicJob = app.job('jobPath', async (ctx) => {
  const now = Math.floor(Date.now() / 1000);
  const twentyMinutesAgo = now - 20 * 60;

  try {
    const response = await getLeads(twentyMinutesAgo, now, ctx);
    const leads = response?.body?.data;

    if (leads && leads.length) {
      await addLeads(ctx, leads);
    } else {
      ctx.account.log('Flocktory. No new leads found');
    }
  } catch (error) {
    ctx.account.log('Error creating job', { json: { error } });
  } finally {
    await scheduleJobAfter(ctx, 20, 'minutes', periodicJob.path(), { status: 'processing' });
  }
});

const startPeriodicJob = app.apiCall('scheduleJob', async (ctx) => {
  await scheduleJobAsap(ctx, periodicJob.path(), { status: 'start' });
});

app.screen('/', (ctx, req) => {
  return (
    <screen>
      <button onClick={startPeriodicJob.apiCall()} class={['primary', 'section']}>
        Запустить периодический процесс
      </button>
    </screen>
  );
});
