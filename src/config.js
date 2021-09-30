export const colors = {
    green: '#00C037',
    lightGreen: '#d2fce3',
    extraLightGreen: '#e3faec',
    blue: '#1778F2',
    lightBlue: '#4598E0',
    darkGray: '#333333',
    lightGray: '#A2A2A2',
    dark: '#000000',
    white: '#FFFFFF',
    bgColor: 'rgba(0,0,0,.85)',
    red: '#DB4C4C',
    darkPurple: '#540A85',
    purple: '#611182',
    lightPurple: '#761E7D'
}

export const images = {
    logo: require('./assets/images/logo.png'),
    googleIcon: require('./assets/images/googleIcon.png'),
    menuIcon: require('./assets/images/menuIcon.png'),
    stockIcon: require('./assets/images/stockIcon.png'),
    buyIcon: require('./assets/images/buyIcon.png'),
    supplierIcon: require('./assets/images/suppliersIcon.png'),
    customerIcon: require('./assets/images/customersIcon.png'),
    pickupIcon: require('./assets/images/pickupIcon.png'),
    billsIcon: require('./assets/images/billsIcon.png'),
    salesIcon: require('./assets/images/salesIcon.png'),
    orderIcon: require('./assets/images/orderIcon.png'),
    stockMillingIcon: require('./assets/images/stockMillIcon.png'),
    millingServiceIcon: require('./assets/images/millingServiceIcon.png'),
    avatar: require('./assets/images/photo.png'),
    curve: require('./assets/images/curve.png'),
    monitor: require('./assets/images/monitor.png'),
    profile: require('./assets/images/profile.png'),
    friends: require('./assets/images/friends.png'),
    preference: require('./assets/images/preference.png'),
    info: require('./assets/images/info.png'),
    support: require('./assets/images/support.png'),
    finance: require('./assets/images/finance.png'),
    find: require('./assets/images/find.png')
}

export const defaultSize = 16;

export const baseUri = 'https://us-central1-agro-waste-mobile-app.cloudfunctions.net/';
export const googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDmO0TPSYtgcPJw8TbBSOaIBFVqs4Ziq2Q&components=country:ug&';
export const googlePlacesDetailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDmO0TPSYtgcPJw8TbBSOaIBFVqs4Ziq2Q&components=country:ug&';

export const errorTextStyle = {
    color: colors.red,
    fontSize: defaultSize * .75,
    textAlign: 'center',
    paddingVertical: defaultSize * .2
}

export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatDecNumber = (num) => {
    return formatNumber((Math.round(num * 100) / 100).toFixed(2))
}