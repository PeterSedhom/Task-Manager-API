const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOneId, 
    userOne,
    userTwoId, 
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    configureDB
} = require('./fixtures/db')

beforeEach(configureDB)

test('should create a task for user' , async () => {
    const respone = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'Test Task'
    })
    .expect(201)

    const task = await Task.findById(respone.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('should return user tasks', async () => {
    const respone = await request(app)
                    .get('/tasks')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)
    expect(respone.body.length).toBe(2)
})

test('should not delete other user tasks', async () => {
    const respone = await request(app)
                    .delete(`/tasks/${taskOne._id}`)
                    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                    .send()
                    .expect(404)
    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})