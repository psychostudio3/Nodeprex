///Converts Given time  in "11:10" format to a Date object
function toTime(str) {
  try {
    var result = str.split(":");
    var time = new Date(1999, 9, 9, result[0], result[1]);
  } catch (err) {
    // TODO Use a proper exception logger here
    console.log(err);
    return;
  }
  return time;
};

///Gets Hour & Min of the  Given time  in "11:10" format 
function getHourAndMin(str) {
  try {
    var result = str.split(":");
    return  { Hour: result[0], Min: result[1] };
  } catch (err) {
    // TODO Use a proper exception logger here
    console.log(err);
    return;
  }
};

///Gets Hour & Min of the  Given Date object 
function getHourAndMinFromDate(date) {
  try {
    return  { Hour: date.getHours(), Min: date.getMinutes() };
  } catch (err) {
    // TODO Use a proper exception logger here
    console.log(err);
    return;
  }
};
// Check if given date  is before todays start (00 am)
function checkBeforeToday(date) {
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);
  return date < yesterday;
}


module.exports = {
  checkBeforeToday: checkBeforeToday,
  toTime: toTime,
  getHourAndMin: getHourAndMin, 
  getHourAndMinFromDate: getHourAndMinFromDate
};