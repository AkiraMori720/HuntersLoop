export function convertTimeFormat12To24(value){ // 12:23 AM -> 00:23
  const [time, meridian] = value.split(' ');

  let [h, m] = time.split(':');

  if (h === '12') {
    h = '00';
  }

  if (meridian === 'PM') {
    h = parseInt(h, 10) + 12;
  }

  var retValue = h + ':' + m;
  return retValue;
}

export function convertTimeFormat24To12(value){ // 12:23 -> 00:23 PM 
  var [h, m] = value.split(":");
  var meridian = '';
  if(h>12){
    meridian = 'PM'; h -= 12;
  }
  else if(h<12){
    meridian = 'AM';
    if(h == 0) h = 12;
  }
  else{
    meridian = 'PM'
  }
  if(h.toString().length == 1) h = '0' + h;

  var retValue = h + ':' + m + ' ' + meridian;
  return retValue;
}
