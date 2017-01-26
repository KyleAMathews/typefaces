module.exports = (numericWeight) => {
  switch (numericWeight) {
    case '100':
      return `Thin`
      break;
    case '200':
      return `Extra Light`
      break;
    case '300':
      return `Light`
      break;
    case '400':
      return `Regular`
      break;
    case '500':
      return `Medium`
      break;
    case '600':
      return `SemiBold`
      break;
    case '700':
      return `Bold`
      break;
    case '800':
      return `ExtraBold`
      break;
    case '900':
      return `Black`
      break;
    default:
      return `normal`
  }
}
