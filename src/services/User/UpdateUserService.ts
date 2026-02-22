import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface UserRequest {
  name: string;
  photo: string;
  phone_number: string;
  email: string;
  birthday: Date;
  userId: string;
}

class UpdateUserService {
  async execute({
    name,
    birthday,
    phone_number,
    userId,
    photo,
    email,
  }: UserRequest) {
    if (!name || !phone_number || !email || !birthday) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const userGet = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userGet) {
      throw new Error("Usuário não encontrado");
    }

    if (userGet.email != email) {
      const userAlreadyExists = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      if (userAlreadyExists) {
        throw new Error("Email já cadastrado");
      }
    }

    let data = {
      name: name,
      email: email,
      birthday: new Date(),
      phone_number: phone_number,
    };

    if (photo) {
      const s3Storage = new S3Storage();

      const upload = await s3Storage.saveFile(photo);

      data["photo"] = upload;
    }

    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: data,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      phone_number: user.phone_number,
    };
  }
}

export { UpdateUserService };
