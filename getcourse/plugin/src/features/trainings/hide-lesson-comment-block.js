const hideLessonCommentBlock = () => {
	document.querySelectorAll('.simple-answer').forEach((element) => {
		if (!element.closest('.lt-lesson-comment-block')?.classList.contains('recode-show-lt-lesson-comment-block'))
			element.classList.add('view-collapsed');
	});
};

export default hideLessonCommentBlock;
