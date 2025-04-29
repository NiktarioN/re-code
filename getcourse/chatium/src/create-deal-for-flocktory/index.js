import { scheduleJobAfter, scheduleJobAsap } from '@app/jobs';
import { createDeal } from '@getcourse/sdk';
import { get } from '@app/request';

const FUNNEL_ID = 19633;
const FUNNEL_STAGE_ID = 191250;
const OFFER_ID = 6673218;
const DEFAULT_COMMENT = 'Заказ создан для обработки ОП от проекта Flocktory';
const UTM_SOURCE = 'flocktory';
const FUID = '220365610';

const toUrlSearchParams = (obj) => new URLSearchParams(obj).toString();
const getPrize = (campaignId) => {
  const prizes = {
    938527: 'Скидка до 50 000 рублей',
  };
  return prizes[campaignId] || 'Скидка до 50 000 рублей';
};

const periodicJob = app.job('jobPath', async (ctx) => {
  const now = Math.floor(Date.now() / 1000);
  const twentyMinutesAgo = now - 20 * 60;

  const requestParams = {
    token: 'zl0j36f5co2724e8v7qq8bjh541f7qdo',
    site_id: '5942',
    from: twentyMinutesAgo,
    to: now,
    add_fields: 'campaign_id',
  };

  const queryString = toUrlSearchParams(requestParams);
  const url = `https://client.flocktory.com/v2/exchange/phone-leads?${queryString}`;
  ctx.account.log(url);

  try {
    const response = await get(url);

    const dealPromises = response?.body?.data.map((data) => {
      const { name, email: userEmail, phone: userPhone, campaign_id: campaignId } = data;

      const [firstName = '', lastName = ''] = (name || '').trim().split(/\s+/);

      return createDeal(ctx, {
        user: {
          first_name: firstName,
          last_name: lastName,
          email: userEmail,
          phone: userPhone,
        },
        system: {
          refresh_if_exists: 0,
        },
        session: {
          utm_source: UTM_SOURCE,
        },
        deal: {
          deal_status: 'new',
          offers: [{ offer_id: OFFER_ID }],
          addtags: ['событие_ЛИД-ФЛОКТОРИ'],
          disable_notifications: true,
          deal_comment: DEFAULT_COMMENT,
          funnel_id: FUNNEL_ID,
          funnel_stage_id: FUNNEL_STAGE_ID,
          addfields: {
            utm_source: UTM_SOURCE,
            fuid: FUID,
            ['Выигрыш']: getPrize(campaignId),
          },
        },
      });
    });

    await Promise.all(dealPromises);

    await scheduleJobAfter(ctx, 20, 'minutes', periodicJob.path(), {
      status: 'processing',
    });
  } catch (error) {
    ctx.account.log(`Error processing job: ${error.message}`, error);
  }
});

const startPeriodicJob = app.apiCall('scheduleJob', async (ctx) => {
  await scheduleJobAsap(ctx, periodicJob.path(), {
    status: 'start',
  });
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