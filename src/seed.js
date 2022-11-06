import { faker } from '@faker-js/faker'
import { config } from './config.js'

let seed = []

for (let i = 0; i < config.seedCount; i++) {
    let date = faker.date.between('2022-01-01T00:00:00.000Z', '2022-31-12T00:00:00.000Z')
    seed.push({
        id: faker.datatype.uuid(),
        appointment: new Date(date).toISOString(),
        customer: faker.name.fullName(),
        description: faker.lorem.sentence(),
        image: faker.internet.avatar(),
    })
}

export default seed