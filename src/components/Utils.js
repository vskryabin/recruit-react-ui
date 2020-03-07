class Utils {
  constructor() {
    this.today = this.getTodaysDate();
    console.log('Today: ' + this.today);
    this.states = {
      'AL': 'Alabama',
      'AK': 'Alaska',
      'AZ': 'Arizona',
      'AR': 'Arkansas',
      'CA': 'California',
      'CO': 'Colorado',
      'CT': 'Connecticut',
      'DE': 'Delaware',
      'DC': 'District Of Columbia',
      'FL': 'Florida',
      'GA': 'Georgia',
      'HI': 'Hawaii',
      'ID': 'Idaho',
      'IL': 'Illinois',
      'IN': 'Indiana',
      'IA': 'Iowa',
      'KS': 'Kansas',
      'KY': 'Kentucky',
      'LA': 'Louisiana',
      'ME': 'Maine',
      'MD': 'Maryland',
      'MA': 'Massachusetts',
      'MI': 'Michigan',
      'MN': 'Minnesota',
      'MS': 'Mississippi',
      'MO': 'Missouri',
      'MT': 'Montana',
      'NE': 'Nebraska',
      'NV': 'Nevada',
      'NH': 'New Hampshire',
      'NJ': 'New Jersey',
      'NM': 'New Mexico',
      'NY': 'New York',
      'NC': 'North Carolina',
      'ND': 'North Dakota',
      'OH': 'Ohio',
      'OK': 'Oklahoma',
      'OR': 'Oregon',
      'PA': 'Pennsylvania',
      'RI': 'Rhode Island',
      'SC': 'South Carolina',
      'SD': 'South Dakota',
      'TN': 'Tennessee',
      'TX': 'Texas',
      'UT': 'Utah',
      'VT': 'Vermont',
      'VA': 'Virginia',
      'WA': 'Washington',
      'WV': 'West Virginia',
      'WI': 'Wisconsin',
      'WY': 'Wyoming'
    }
  }

  getTodaysDate() {
    var date = new Date(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  getISODate(originalDate) {
    var date = new Date(originalDate);
    // console.log("Original Date");
    // console.log(originalDate);

    var ISODate = date.toISOString();
    // console.log("ISO Date");
    // console.log(ISODate);

    var shortISODate = this.getShortDate(ISODate);
    // console.log("Short ISO Date");
    // console.log(shortISODate);
    return shortISODate;
  }

  getLocalizedDate(ISODate) {
    // console.log("ISO Date");
    // console.log(ISODate);
    var localizedDate = '';

    if (this.isNotNull(ISODate) && !ISODate.includes('0000-00-00')) {
      var date = new Date(ISODate);
      // DB in America/New_York
      localizedDate = date.toLocaleDateString('en-US', { timeZone: 'America/New_York' });
      // localizedDate = date.toLocaleDateString();
    }
    // console.log("Localized Date");
    // console.log(localizedDate);
    return localizedDate;
  }

  getShortDate(longDate) {
    // console.log('Long date:');
    // console.log(longDate);
    var shortDate = '';
    if (this.isNotNull(longDate) && !longDate.includes('0000-00-00')) {
      var date = new Date(longDate),
      month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      shortDate = [year, month, day].join('-');
      // console.log('Short date:');
      // console.log(shortDate);
    }
    return shortDate;
  }

  createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  convertDateToUTC(date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
  }
  
  convertDateToNY(date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
  }

  getFullAddress(address, city, state, zip) {
    let fullAddress = '';
    if(this.isNotNull(address)) {
      fullAddress = address;
    }
    if(this.isNotNull(city)) {
      if (fullAddress !== '') {
        fullAddress = fullAddress + ', ';
      }
      fullAddress = fullAddress + city;
    }
    if(this.isNotNull(state)) {
      if (fullAddress !== '') {
        fullAddress = fullAddress + ', ';
      }
      fullAddress = fullAddress + state;
    }
    if(this.isNotNull(zip)) {
      if (fullAddress !== '') {
        fullAddress = fullAddress + ' ';
      }
      fullAddress = fullAddress + zip;
    }
    return fullAddress;
  }

  getFullName(firstName, middleName, lastName) {
    let name = '';

    if(this.isNotNull(firstName)) {
      name = firstName;
    }
    if(this.isNotNull(middleName)) {
      if (name !== '') {
        name = name + ' ';
      }
      name = name + middleName;
    }
    if(this.isNotNull(lastName)) {
      if (name !== '') {
        name = name + ' ';
      }
      name = name + lastName;
    }
    return name;
  }

  isNotNull(object) {
    if (typeof object !== "undefined" && object !== null && object !== '') {
      return true;
    } else {
      return false;
    }
  }

  getStateByValue(value) {
    if (this.isNotNull(this.states[value])) {
      return this.states[value];
    } else {
      return '';
    }
  }

  isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

const utils = new Utils();

export default utils;