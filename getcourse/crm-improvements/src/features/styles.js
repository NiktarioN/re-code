import { isCrmPage } from '../config/constants';

const addStyles = () => {
	if (!isCrmPage) {
		return;
	}

	const style = document.createElement('style');
	style.id = 'recode-crm-improvements';
	style.innerHTML = `
  .recode-crm__attention {
    margin-top: 3px;
  }

  .recode-crm__attention-text {
    display: inline-block;
    padding: 6px 10px;
    border-radius: 10px;
    background-color: #f6cd94;
    line-height: 1.2;
    color: #333333;
  }

  .recode-crm__attention-text > i {
    color: #333333 !important;
  }

  .recode-task-highlight {
    border: 2px solid #2d73e7 !important;
  }

  .recode-task-hide-trash div:has(> .btn-take-task-link),
  .recode-task-hide-trash .btn-take-task-link,
  .recode-task-hide-trash .make-delay-btn,
  .recode-task-hide-trash .field-description-block {
    display: none !important;
  }

  .task-form.recode-task-big-buttons .task-jobs .abstract-job-widget .results-block {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    width: 100%;
    padding: 0px !important;
  }

  .task-form.recode-task-big-buttons .task-jobs .abstract-job-widget .btn {
    border-radius: 6px !important;
  }

  @media (max-width: 768px) {
    .task-form.recode-task-big-buttons .task-jobs .abstract-job-widget .results-block {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 576px) {
    .task-form.recode-task-big-buttons .task-jobs .abstract-job-widget .results-block {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .task-form.recode-task-big-buttons .task-jobs .abstract-job-widget [data-field="comment"] {
    margin-bottom: 15px;
  }

  .recode-deal-panel-highlight {
    border-radius: 14px !important;
    border: 2px solid #2d73e7 !important;
    overflow: hidden !important;
    box-shadow: 1px 1px 1px rgba(0,0,0,.05) !important;
    opacity: 1 !important;
  }

  .recode-manager-link {
    display: inline-block;
  }

  .recode-manager-link--note {
    margin-top: 3px;
    font-size: 12px;
    line-height: 1.2;
  }
  `;

	document.head.appendChild(style);
};

export default addStyles;
