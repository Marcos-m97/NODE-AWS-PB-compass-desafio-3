 export function validarTelefone(telefone: string): boolean {
    const regexTelefone = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return regexTelefone.test(telefone);
  }
  
   export function validarnomeCompleto(nomeCompleto: string): boolean {
    const regexnomeCompleto = /^((\b[A-Za-zÀ-ú']{2,40}\b)\s*){2,}$/;
    return regexnomeCompleto.test(nomeCompleto);
  }
  

  export function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ""); 
  
    if (cpf.length !== 11) return false; 
  
    
    let soma = 0;
    let peso = 10;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let primeiroDigito = 11 - (soma % 11);
    if (primeiroDigito === 10 || primeiroDigito === 11) primeiroDigito = 0;
    if (primeiroDigito !== parseInt(cpf.charAt(9))) return false;
  
    
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let segundoDigito = 11 - (soma % 11);
    if (segundoDigito === 10 || segundoDigito === 11) segundoDigito = 0;
    if (segundoDigito !== parseInt(cpf.charAt(10))) return false;
  
    return true;
  }
  
  export function validarEmail(e_mail: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(e_mail);
  }
  