import request from 'supertest'
import { app } from '../../app'

it('returns 201 on successful singup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(201)
})

it('returns 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "testtcm",
            password: "123123123"
        })
        .expect(400)
})

it('returns 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "12"
        })
        .expect(400)
})

it('returns 400 with missing email and password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it('dissalows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(400)
})

it('sets a cookie after signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined()
})