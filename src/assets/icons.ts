const getIconNamed = (iconName: string) => {
  switch (iconName) {
    case 'icon_coat_mch':
      return require('./poi/icon_coat_mch.png');
    case 'icon_coat_nds':
      return require('./poi/icon_coat_nds.png');
    case 'icon_h':
      return require('./poi/icon_h.png');
    default:
      return null;
  }
};

export default getIconNamed;
