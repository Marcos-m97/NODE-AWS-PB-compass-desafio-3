import 'dotenv/config'
import { User } from '../models/usermodel.js'
import bcrypt from 'bcrypt'
import { AppErrors } from '../middlewares/errorMiddlewere.js'

export async function createSeed(): Promise<User | undefined> {
  try {
    const createdSeed = await User.findOne({
      where: { email: process.env.DEFAULT_EMAIL! }
    })
    if (createdSeed) {
      return createdSeed
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(process.env.DEFAULT_EMAIL!)) {
        throw new AppErrors(
          'E-mail padrão inválido. Verifique a variável DEFAULT_EMAIL nas credenciais de ambiente.',
          400
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
