const getFormattedDateFromDateObj = (date) => {
  if (date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    const result = `${mm}/${dd}/${yyyy}`;
    return result;
  }
  return null;
};

const getFormattedDateTimeFromDateObj = (date) => {
  if (date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
      hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
      minute = `0${minute}`;
    }
    const result = `${mm}/${dd}/${yyyy} ${hour}:${minute}`;
    return result;
  }
  return null;
};

const getFormattedDate = (dateStr) => {
  const date = new Date(dateStr);
  if (date) {
    return getFormattedDateFromDateObj(date);
  }
  return null;
};

const getToday = () => {
  const today = new Date();
  return getFormattedDateFromDateObj(today);
};

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getFormattedDateFromDateObj(tomorrow);
};

const getAfterOneYear = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 365);
  return getFormattedDateFromDateObj(tomorrow);
};

export default {
  getToday,
  getFormattedDate,
  getTomorrow,
  getAfterOneYear,
  getFormattedDateFromDateObj,
  getFormattedDateTimeFromDateObj,
};
