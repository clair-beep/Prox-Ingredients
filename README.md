
# Prox

This is a full stack application that provides users with skin products, explaining ingredients and their uses. It has a backend built with Node.js and Express.js, and a frontend built with HTML, CSS, and JavaScript. The application also uses a cloud-based image management service called Cloudinary.



## Installation

Clone my proyect
```bash
  https://github.com/clair-beep/Prox-Ingredients.git
```

Navigate to the project directory:

```bash
cd Prox-Ingredients

```


Install the dependecies
```bash
npm Install
```
        
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`PORT`

`MONGO_URI`

`CLOUD_NAME`

`API_KEY`

`API_SECRET`

`MAX_FILE_UPLOAD`

## Deployment

To deploy this project run

```bash
  npm run dev
```


## API Reference

#### Get all products

```http
  GET /v1/categories/:categoriesId/products
  @access Public

```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `categoriesId` | `string` | **Required**. categoriesId |

#### Get a single product


```http
  GET /v1/product/:id
  @access Public

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Search products

```http
  GET /v1/products/search
  @access Public

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `parameters`      | `string` | **Required**. req.parameters to fetch from db |

#### Add a single product

```http
  GET /v1/products/search
  @access Private

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `parameters`      | `string` | **Required**. categoryId to add product to that specific category |







## License
This License Agreement (the "Agreement") is made and entered into on November 2022 by and between Marie Claire Mateus ("Licensor") and any person who downloads or uses the Prox Analyzer Full-Stack Application (the "Software").

License Grant
Licensor hereby grants to any person who downloads or uses the Software a non-exclusive, royalty-free, worldwide license to use, modify, reproduce, distribute, display, and perform the Software and to make derivative works based on the Software, solely for non-commercial purposes.

Contributions
Any person who contributes to the Software shall grant to Licensor a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, modify, reproduce, distribute, display, and perform any contributions.

Disclaimer of Medical Advice
The Software is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Licensor is not a doctor and does not recommend the use of any particular skincare product. Users should always consult with their healthcare providers regarding any skincare concerns.

No Warranty
The Software is provided "as is" without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. Licensor makes no warranty that the Software will be error-free or that it will meet any particular criteria of performance or quality.

Limitation of Liability
In no event shall Licensor be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use or inability to use the Software, even if Licensor has been advised of the possibility of such damages.

Indemnification
Any person who downloads or uses the Software agrees to indemnify, defend, and hold harmless Licensor from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or in connection with the use or inability to use the Software.

Governing Law
This Agreement shall be governed by and construed in accordance with the laws of Colombia, without giving effect to its conflict of laws provisions.

Entire Agreement
This Agreement constitutes the entire agreement between Licensor and any person who downloads or uses the Software and supersedes all prior or contemporaneous communications and proposals, whether oral or written, between Licensor and such person.

By downloading or using the Prox Full-Stack Application, you agree to be bound by the terms and conditions of this Agreement. If you do not agree to the terms and conditions of this Agreement, do not download or use the Software.


