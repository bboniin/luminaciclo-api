# Lumina API

API para o aplicativo Lumina.

## Instalação

```bash
yarn install
```

## Rodando a aplicação

```bash
yarn dev
```

## Estrutura do Projeto

O projeto é organizado da seguinte forma:

- `prisma/`: Contém o schema do banco de dados e as migrações.
- `src/`: Contém o código fonte da aplicação.
  - `controllers/`: Contém os controllers para cada rota da aplicação.
  - `services/`: Contém as regras de negócio da aplicação.
  - `middlewares/`: Contém os middlewares da aplicação.
  - `routes.ts`: Arquivo com a definição de todas as rotas.
  - `server.ts`: Arquivo principal que inicializa o servidor.

---

## Documentação da API

### Autenticação

A maioria das rotas requer autenticação. Para se autenticar, envie uma requisição `POST` para `/session` com o email e a senha do usuário. Você receberá um token de autenticação que deve ser enviado no header `Authorization` de todas as requisições subsequentes.

`Authorization: Bearer <token>`

### Usuários

#### `POST /users`

Cria um novo usuário. (Rota pública)

**Request Body:**

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "senha",
  "phone_number": "11999999999",
  "birthday": "2000-01-01T00:00:00.000Z",
  "photo": "(file)"
}
```

#### `POST /session`

Autentica um usuário. (Rota pública)

**Request Body:**

```json
{
  "email": "usuario@email.com",
  "password": "senha"
}
```

### Diário

#### `POST /diaries`

Cria um novo registro no diário para o usuário autenticado.

**Request Body:**

```json
{
  "description": "Texto do diário",
  "symptoms": "Sintomas do dia"
}
```

#### `GET /diaries`

Retorna o registro do diário do usuário autenticado para uma data específica. Se nenhuma data for fornecida, retorna o registro do dia atual.

**Query Params:**

- `date` (opcional): Data no formato `YYYY-MM-DD`.

#### `PUT /diaries/:id`

Atualiza um registro do diário.

**Request Body:**

```json
{
  "description": "Novo texto do diário",
  "symptoms": "Novos sintomas"
}
```

### Insights

#### `GET /insights`

Retorna uma lista de insights para os usuários.

#### `GET /insights/:id`

Retorna um insight específico.

### Artigos

#### `GET /articles`

Retorna uma lista de artigos para os usuários.

#### `GET /articles/:id`

Retorna um artigo específico.

### Nutrição

#### `GET /nutritions`

Retorna uma lista de conteúdos de nutrição para os usuários.

#### `GET /nutritions/:id`

Retorna um conteúdo de nutrição específico.

### Exercícios

#### `GET /exercises`

Retorna uma lista de exercícios para os usuários.

#### `GET /exercises/:id`

Retorna um exercício específico.

---

### Rotas de Administrador

As rotas de administrador requerem autenticação de administrador e estão prefixadas com `/admin`.

#### `GET /admin/users`

Lista todos os usuários.

#### Insights (Admin)

- `POST /admin/insights`: Cria um novo insight com múltiplos conteúdos.
- `GET /admin/insights`: Lista todos os insights.
- `GET /admin/insights/:id`: Retorna um insight específico.
- `PUT /admin/insights/:id`: Atualiza um insight.
- `DELETE /admin/insights/:id`: Deleta um insight.

**Exemplo de corpo para `POST` e `PUT` em `/admin/insights`:**
A requisição deve ser `multipart/form-data`.

- `title`: Título do insight.
- `description`: Descrição.
- `brief_description`: Descrição breve.
- `phase`: `MENSTRUAL` | `FOLICULAR` | `OVULATORIA` | `LUTEA`
- `type`: Tipo do insight.
- `language`: Idioma.
- `active`: `true` ou `false`.
- `photo`: Arquivo da imagem principal.
- `contents`: String JSON com a estrutura dos conteúdos.
- `content_files`: Arquivos dos conteúdos (para tipos `image` e `video`).

**Exemplo de `contents` (JSON string):**

```json
[
  { "type": "title", "value": "Subtítulo", "order": 0 },
  { "type": "image", "value": "placeholder_for_file_1", "order": 1 },
  { "type": "text", "value": "Texto do conteúdo.", "order": 2 }
]
```

Os arquivos em `content_files` devem ser enviados na mesma ordem dos placeholders no array `contents`.

... (A documentação para Artigos, Nutrição e Exercícios seguirá o mesmo padrão) ...
