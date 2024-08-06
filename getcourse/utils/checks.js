const { isAdmin, isTeacher } = window?.userInfo;
const isEmployee = isAdmin || isTeacher;

const isChatium = !!document.querySelector('body.chatium_body');

const isTargetUserId = (ids) => ids.some((id) => id.toString() === window.accountUserId.toString());

const hasFormTask = !!document.querySelector('.task-form');

export { isAdmin, isEmployee, isChatium, isTargetUserId, hasFormTask };
