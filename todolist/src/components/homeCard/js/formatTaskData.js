const now = new Date()
// 将原始taskList数据格式化，修改到期时间的格式
function formatTaskData() {
  return (task) => {
    const completeTime = new Date(task.complete_time);
    const startTime = new Date(task.start_time);
    // 判断是否同一个月
    const isSameMonth = (new Date(completeTime.getFullYear(), completeTime.getMonth(), 1, 0, 0, 0) - new Date(startTime.getFullYear(), startTime.getMonth(), 1, 0, 0, 0)) === 0
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const nowEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    // 和当前时间做比较用
    const completeDiffDays = Math.round((completeTime - nowEndDate) / (1000 * 60 * 60 * 24));
    const startDiffDays = Math.round((startTime - nowDate) / (1000 * 60 * 60 * 24));
    let completeDate;
    if ((task.start_time === null && task.complete_time !== null) || completeDiffDays === startDiffDays) {
      //开始时间空，或者 开始结束同一天，不用显示范围
      if (completeDiffDays === 0) {
        completeDate = 'Today';
      } else if (completeDiffDays === 1) {
        completeDate = 'Tomorrow';
      } else if (completeDiffDays >= 2 && completeDiffDays <= 6) {
        const options = {weekday: 'short'};
        completeDate = new Intl.DateTimeFormat('en-US', options).format(completeTime);
      } else {
        const options = {month: 'short', day: 'numeric'};
        completeDate = new Intl.DateTimeFormat('en-US', options).format(completeTime);
      }
    } else if (task.start_time !== null && task.complete_time !== null && completeDiffDays !== startDiffDays) {
      //显示范围
      if (startDiffDays === 0) {
        const options = {month: 'short', day: 'numeric'};
        const completeDate2 = new Intl.DateTimeFormat('en-US', options).format(completeTime);
        completeDate = 'Today-' + completeDate2
      } else if (completeDiffDays === 0) {
        const options = {month: 'short', day: 'numeric'};
        const completeDate1 = new Intl.DateTimeFormat('en-US', options).format(startTime);
        completeDate = completeDate1 + '-Today'
      } else if (isSameMonth) {
        // 同一个月
        const options = {month: 'short', day: 'numeric'};
        const options2 = {day: 'numeric'};
        const completeDate1 = new Intl.DateTimeFormat('en-US', options).format(startTime);
        const completeDate2 = new Intl.DateTimeFormat('en-US', options2).format(completeTime);
        completeDate = completeDate1 + '-' + completeDate2
      } else {
        const options = {month: 'short', day: 'numeric'};
        completeDate = new Intl.DateTimeFormat('en-US', options).format(startTime) + '-' + new Intl.DateTimeFormat('en-US', options).format(completeTime);
      }
    } else {
      completeDate = ''
    }
    return {
      ...task,
      complete_date: completeDate,
      complete_date1: completeDate,
    };
  };
}

export default formatTaskData