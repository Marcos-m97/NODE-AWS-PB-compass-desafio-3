import 'dotenv/config'
import { User } from '../models/usermodel.js'
import bcrypt from 'bcrypt'
import { AppErrors } from '../middlewares/errorMiddlewere.js'
import { validarEmail, validPassword } from '../utilis/functions.js'

export async function createSeed(): Promise<User | undefined> {
  try {
    const createdSeed = await User.findOne({
      where: { email: process.env.DEFAULT_EMAIL! }
    })
    if (createdSeed) {
      return
    } else {
      if (validarEmail(process.env.DEFAULT_EMAIL!) == false) {
        throw new AppErrors(
          'E-mail padrão inválido. Verifique a variável DEFAULT_EMAIL nas credenciais de ambiente.',
          400
        )
      }
      if (process.env.DEFAULT_PASSWORD!.length < 6) {
        throw new AppErrors(
          'Formato de senha invalido. No minimo uma letra maiuscula e 6 caracteres são necessários.',
          404
        )
      }
      if (validPassword(process.env.DEFAULT_PASSWORD!) == false) {
        throw new AppErrors(
          'Formato de senha invalido. No minimo uma letra maiuscula e 6 caracteres são necessários.',
          404
        )
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_PASSWORD!,
        saltRounds
      )

      const seed = User.build({
        fullName: process.env.DEFAULT_NAME!,
        email: process.env.DEFAULT_EMAIL!,
        password: hashedPassword!
      })
      console.log('seed salva no banco de dados com sucesso!')
      return await seed.save()
    }
  } catch (err) {
    console.log(err)
  }
}

export default createSeed
