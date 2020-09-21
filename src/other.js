export const formatDateTime = function (datetime, type, from) {
  /* Форматирование даты
      datetime - в форматах '23.12.2017 17:40', '2017-11-23T17:40:00+03:00'
      type - 'datetime', либо 'date'('23.12.2017', '2017-11-23')
      from - если true, то '2017-11-23T17:40:00+03:00' -> '23.12.2017 17:40'
  */
  let date = ''
  let time = ''
  // from backend
  if (!datetime) return ''
  let datetimeList
  let dateList
  if (from) {
    datetimeList = from === 'empty' ? datetime.split(' ') : datetime.split('T')
    date = datetimeList[0]
    if (datetimeList.length === 2) time = datetimeList[1]

    dateList = date.split('-')
    date = [dateList[2], dateList[1], dateList[0]].join('.')

    if (time) {
      var timeList = time.split(':')
      time = [timeList[0], timeList[1]].join(':')
    }

    datetime = date + ' ' + time
  } else {
    datetimeList = datetime.split(' ')
    date = datetimeList[0]

    if (datetimeList.length === 2) {
      time = datetimeList[1]
    } else {
      if (type === 'datetime') time = '00:00'
      else type = 'date'
    }

    dateList = date.split('.')
    date = [dateList[2], dateList[1], dateList[0]].join('-')

    datetime = date + ' ' + time
  }

  var result = ''
  switch (type) {
    case 'date':
      result = date
      break
    case 'time':
      result = time
      break
    default:
      result = datetime
      break
  }

  return result
}

export const autoKeyboardLang = function (str) {
  const s = [
    'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
    'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
    'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'
  ]

  const r = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '\\[', '\\]',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'',
    'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '\\.'
  ]

  for (let i = 0; i < r.length; i++) {
    const reg = new RegExp(r[i], 'mig')
    str = str.replace(reg, function (a) {
      return a === a.toLowerCase() ? s[i] : s[i].toUpperCase()
    })
  }

  return str
}
