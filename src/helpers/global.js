export const errorResponse = (response) => {
  let err = {
    status: response.response.status,
    message: response.response.data.message,
    errors: [],
    //message: ((response.response.data.message === undefined) ? response.response.data.data : response.response.data.message),
  }
  err.message =
    err.message === 'The given data was invalid.'
      ? 'La informacion enviada es inválida.'
      : err.message

  switch (response.response.status) {
    case 422:
      if (response.response.data.errors !== undefined) {
        err.errors = Object.keys(response.response.data.errors).map((i) => {
          return response.response.data.errors[i][0]
        })
      }
      break
    case 500:
      err.errors[err.errors.length] = 'sin acceso a servidor, intentelo más tarde...'
      break
    default:
      break
  }
  return err
}

export const colorBadge = (status) => {
  switch (status) {
    case 1:
      return 'success'
    case 0:
      return 'secondary'
    default:
      return 'primary'
  }
}

export const URLVariable = (props, variable) => {
  let query = props.location.search.substring(1)
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return null
}

const Unidades = (num) => {
  switch (num) {
    case 1:
      return 'UN'
    case 2:
      return 'DOS'
    case 3:
      return 'TRES'
    case 4:
      return 'CUATRO'
    case 5:
      return 'CINCO'
    case 6:
      return 'SEIS'
    case 7:
      return 'SIETE'
    case 8:
      return 'OCHO'
    case 9:
      return 'NUEVE'
    default:
      return ''
  }
} //Unidades()

const Decenas = (num) => {
  let decena = Math.floor(num / 10)
  let unidad = num - decena * 10

  switch (decena) {
    case 1:
      switch (unidad) {
        case 0:
          return 'DIEZ'
        case 1:
          return 'ONCE'
        case 2:
          return 'DOCE'
        case 3:
          return 'TRECE'
        case 4:
          return 'CATORCE'
        case 5:
          return 'QUINCE'
        default:
          return 'DIECI' + Unidades(unidad)
      }
    case 2:
      switch (unidad) {
        case 0:
          return 'VEINTE'
        default:
          return 'VEINTI' + Unidades(unidad)
      }
    case 3:
      return DecenasY('TREINTA', unidad)
    case 4:
      return DecenasY('CUARENTA', unidad)
    case 5:
      return DecenasY('CINCUENTA', unidad)
    case 6:
      return DecenasY('SESENTA', unidad)
    case 7:
      return DecenasY('SETENTA', unidad)
    case 8:
      return DecenasY('OCHENTA', unidad)
    case 9:
      return DecenasY('NOVENTA', unidad)
    case 0:
      return Unidades(unidad)
    default:
      return ''
  }
} //Unidades()

const DecenasY = (strSin, numUnidades) => {
  if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades)

  return strSin
} //DecenasY()

const Centenas = (num) => {
  let centenas = Math.floor(num / 100)
  let decenas = num - centenas * 100

  switch (centenas) {
    case 1:
      if (decenas > 0) return 'CIENTO ' + Decenas(decenas)
      return 'CIEN'
    case 2:
      return 'DOSCIENTOS ' + Decenas(decenas)
    case 3:
      return 'TRESCIENTOS ' + Decenas(decenas)
    case 4:
      return 'CUATROCIENTOS ' + Decenas(decenas)
    case 5:
      return 'QUINIENTOS ' + Decenas(decenas)
    case 6:
      return 'SEISCIENTOS ' + Decenas(decenas)
    case 7:
      return 'SETECIENTOS ' + Decenas(decenas)
    case 8:
      return 'OCHOCIENTOS ' + Decenas(decenas)
    case 9:
      return 'NOVECIENTOS ' + Decenas(decenas)
    default:
      return Decenas(decenas)
  }
} //Centenas()

const Seccion = (num, divisor, strSingular, strPlural) => {
  let cientos = Math.floor(num / divisor)
  let resto = num - cientos * divisor

  let letras = ''

  if (cientos > 0)
    if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural
    else letras = strSingular

  if (resto > 0) letras += ''

  return letras
} //Seccion()

const Miles = (num) => {
  let divisor = 1000
  let cientos = Math.floor(num / divisor)
  let resto = num - cientos * divisor

  let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL')
  let strCentenas = Centenas(resto)

  if (strMiles === '') return strCentenas

  return strMiles + ' ' + strCentenas
} //Miles()

const Millones = (num) => {
  let divisor = 1000000
  let cientos = Math.floor(num / divisor)
  let resto = num - cientos * divisor

  let strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES')
  let strMiles = Miles(resto)

  if (strMillones === '') return strMiles

  return strMillones + ' ' + strMiles
} //Millones()

export const NumeroLiteral = (num) => {
  let data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: Math.round(num * 100) - Math.floor(num) * 100,
    letrasCentavos: '',
    letrasMonedaPlural: 'BOLIVIANOS',
    letrasMonedaSingular: 'BOLIVIANO',

    letrasMonedaCentavoPlural: 'CENTAVOS',
    letrasMonedaCentavoSingular: 'CENTAVO',
  }

  if (data.centavos > 0) {
    data.letrasCentavos = data.centavos + '/100'
  }

  if (data.centavos === 0) {
    data.letrasCentavos = '00/100'
  }

  if (data.enteros === 0) return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos
  if (data.enteros === 1)
    return Millones(data.enteros) + ' ' + data.letrasCentavos + ' ' + data.letrasMonedaSingular
  else return Millones(data.enteros) + ' ' + data.letrasCentavos + ' ' + data.letrasMonedaPlural
}

export const SerialNumber = (num) => {
  let serial = '00000000'
  // return serial.substring(num.length, 8) + num;
  return serial.substring(0, serial.length - num.length) + num
  // return num.length;
}

export const SelectStyles = (theme) => {
  return {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#212631' : '#fff',
      borderColor: state.isFocused
        ? theme === 'dark'
          ? '#6c757d'
          : '#007bff'
        : theme === 'dark'
          ? '#495057'
          : '#ced4da',
      color: theme === 'dark' ? '#fff' : '#495057',
      boxShadow: state.isFocused
        ? theme === 'dark'
          ? '0 0 0 1px #007bff'
          : '0 0 0 1px #80bdff'
        : null,
      '&:hover': {
        borderColor: theme === 'dark' ? '#6c757d' : '#80bdff',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#212631' : '#fff',
      color: theme === 'dark' ? '#fff' : '#495057',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme === 'dark'
          ? '#007bff'
          : '#007bff'
        : state.isFocused
          ? theme === 'dark'
            ? '#495057'
            : '#e9ecef'
          : theme === 'dark'
            ? '#343a40'
            : '#fff',
      color: state.isSelected ? '#fff' : theme === 'dark' ? '#adb5bd' : '#495057',
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#495057' : '#e9ecef',
        color: '#fff',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#fff' : '#495057',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#adb5bd' : '#6c757d',
    }),
  }
}
