const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, configureDB } = require('./fixtures/db')

beforeEach(configureDB)

test('should sign up a new user', async () => {
    const respone = await request(app)
    .post('/users')
    .send({
        name: 'Peter',
        email: 'peteisnotk@example.com',
        password: 'Adjopjd23o'
    }).expect(201)

    //Assert DB was updated correctly 
    const user = await User.findById(respone.body.user._id)
    expect(user).not.toBeNull()

    //Assert about respone
    expect(respone.body).toMatchObject({
        user: {
            name: 'Peter'
        }
    })

    //Assert PW was not stored in plain word
    expect(user.password).not.toBe('Adjopjd23o')
})

test('should login existent user', async () => {
    const response = await request(app)
    .post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
     }).expect(200)

     const user = await User.findById(response.body.user._id)
     expect(response.body.token).toBe(user.tokens[1].token)
}) 

test('should not login non existent user', async () => {
    await request(app)
    .post('/users/login')
    .send({
        email: userOne.email,
        password: 'thisisawrongpw!'
    }).expect(400)
})

test('should get user profile', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get unauthenticated  user profile', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete user profile', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete unauthenticated user profile', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401 )
})

test('should upload users avatar', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/test.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Mike'
    })
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Mike')    
})

test('should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'Egypt'
    })
    .expect(400)   
})