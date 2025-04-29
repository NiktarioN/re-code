const { isAdmin, isTeacher } = window?.userInfo;

const isEmployee = isAdmin || isTeacher;

const isChatium = !!document.querySelector('body.chatium_body');

const isTargetUserId = (ids) => ids.some((id) => id.toString() === window.accountUserId?.toString());

const hasPermission = (idList, notMode) => {
  const isTargetUser = notMode ? !isTargetUserId(idList) : isTargetUserId(idList);
  return isTargetUser && !window.isSublogined;
};

const hasFormTask = !!document.querySelector('.task-form');

export { isAdmin, isEmployee, isChatium, isTargetUserId, hasPermission, hasFormTask };
