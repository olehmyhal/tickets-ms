import request from "supertest"
import { app } from '../../app'

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(400)
})

it('fails when incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "12312312"
        })
        .expect(400)
})

it('set cookie after signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(201)
    
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@test.com",
            password: "123123123"
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})