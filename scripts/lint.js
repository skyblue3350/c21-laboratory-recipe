const yaml = require('js-yaml')
const fs = require('fs')
const util = require('util')

process.exitCode = 0

const lint = async (targetdir) => {
    const ids = []

    const readdirAsync = util.promisify(fs.readdir)
    const files = (await readdirAsync(targetdir))
    
    files.map((file) => {
        const p = `${targetdir}${file}`
        const data = yaml.safeLoad(fs.readFileSync(p))

        for (recipe of data) {
            // required fields
            const required_fields = ['name', 'no', 'rank', 'recipe']
            const not_found = required_fields.filter((field) => !(field in recipe))
            not_found.map(field => {
                process.exitCode = 1
                console.error('\x1b[31m', `Required field not included: ${recipe.name} (${field})`)
            })

            // check no type
            if (typeof recipe.no !== 'number') {
                console.error('\x1b[31m', `Invalid field type: ${recipe.name} (${field} not number)`)
            } else {
                // check duplication
                if (ids.includes(recipe.no)) {
                    process.exitCode = 1
                    console.error('\x1b[31m', `Not a unique recipe no: ${recipe.name} (${recipe.no})`)
                }
                ids.push(recipe.no)
            }

            // check rank
            if (!['ルーキー', '一等兵', '上等兵', '兵長', '軍曹', '少尉', '中尉', '大尉'].includes(recipe.rank)) {
                console.error('\x1b[31m', `Invalid rank name: ${recipe.name} (${recipe.rank})`)
            }

            recipe.recipe.map((item) => {
                const def = {
                    item: 'string',
                    required: 'number',
                    safety: 'boolean'
                }
                for (field of ['item', 'required', 'safety']) {
                    // check item fields
                    if (!(field in item)) {
                        process.exitCode = 1
                        console.error('\x1b[31m', `Required field not included: ${recipe.name} (${field})`)
                        continue
                    }
                    // check item fields type
                    if (typeof item[field] !== def[field]) {
                        process.exitCode = 1
                        console.error('\x1b[31m', `Invalid field type: ${recipe.name} (${field} not ${def[field]})`)
                    }
                }
            })
        }
    })

    if (process.exitCode == 0) {
        console.log('\x1b[32m', 'Passed all check')
    } else {
        console.error('\x1b[31m', 'There were some errors please check it')
    }
}

lint('./src/resources/')
