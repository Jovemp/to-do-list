import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'Campo "${path}" é obrigatório',
    oneOf: 'Campo "${path}" deve conter o mesmo valor que: ${values}',
  },
  number: {
    min: 'Deve ser maior que ${min}',
    max: 'Deve ser menor que ${max}',
  },
  string: {
    min: 'Campo "${path}" deve ter pelo menos ${min} caracteres',
    max: 'Campo "${path}" deve ter no máximo ${max} caracteres',
    email: 'Campo "${path}" deve ser um email válido',
  },
});