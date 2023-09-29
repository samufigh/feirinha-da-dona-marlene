import { faker } from '@faker-js/faker';
import app from "../src/index";
import supertest from "supertest";
import httpStatus from "http-status";
import { fruitCreate } from './factories/fruit-factory';


const api = supertest(app)

describe("POST /fruits tests", () => {
    it("should return 201 when inserting a fruit", async () => {
        const fruit = {
            name: faker.word.verb(),
            price: faker.commerce.price()
        }
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(httpStatus.CREATED)
    })

    it("should return 409 when inserting a fruit that is already registered", async () => {
        const fruit = {
            name: "banana",
            price: faker.number.int()
        }
        fruitCreate(fruit.name, fruit.price)
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(httpStatus.CONFLICT)
    })

    it("should return 422 when inserting a fruit with data missing", async () => {
        const fruit = {
            name: "banana"
        }
        const {status} = await api.post("/fruits").send(fruit)
        expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })
})

describe("GET /fruits tests", () => {
    it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
        const {status} = await api.get("/fruits/10")
        expect(status).toBe(httpStatus.NOT_FOUND)
    })

    it("should return 400 when id param is present but not valid", async () => {
        const {status} = await api.get("/fruits/true")
        expect(status).toBe(httpStatus.BAD_REQUEST)
    })

    it("should return one fruit when given a valid and existing id", async () => {
        fruitCreate(faker.word.words(), faker.number.int())
        const {status, body} = await api.get("/fruits/1")
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(String)
        })
    })
    it("should return all fruits if no id is present", async () => {
        fruitCreate(faker.word.words(), faker.number.int())
        fruitCreate(faker.word.words(), faker.number.int())

        const {status, body} = await api.get("/fruits")
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                }),
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        )
    })
})
