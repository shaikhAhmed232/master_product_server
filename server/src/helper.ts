export const getEnvVar = (key:string):string => {
    let value = process.env[key]
    if (!value) {
        throw new Error(`Please set ${key}`)
    }
    return value
}

const createCondtions = (where:object | undefined) => {
     let conditions = "";
            if (where) {
                let keys = Object.keys(where)
                let values = Object.values(where).map((value:string) => typeof value === "string" ? `'${value}'` : value)
                keys.forEach((key:string, index: number) => {
                    conditions += `${key} = ${values[index]} ${index == keys.length - 1 ? '' : ' AND '}`
                })
            }
        return conditions;
}

export let QueryBuilder = {
    build: {
        save: (table:string, data:object):string => {
            let selections = Object.keys(data).map((each:string) => each).join(",")
            let values = Object.values(data).map((value:string,idx:number) => `$${idx + 1}`).join(",")
            let query = `INSERT INTO ${table} (${selections}) VALUES(${values}) ${table==='products' ? 'RETURNING products.product_id' : ''} `
            return query
        },
        filter: (table:string, options?: {columns?:string[], where?: object}):string => {
            let conditions = createCondtions(options?.where)
            let query = `SELECT ${options?.columns ? options.columns.join(",") : "*"} FROM ${table} ${conditions ?  `WHERE ${conditions}` : ''}`
            return query;
        },
        delete: (table:string, where:object):string => {
            let condition = createCondtions(where)
            let query = `DELETE FROM ${table} WHERE ${condition}`
            return query
        },
        update: (table:string, options:{columns: object, where:object}):string => {
            let conditions = createCondtions(options.where);
            let columnKeys = Object.keys(options.columns)
            let columnValues = Object.values(options.columns).map((value:string | number | boolean) => typeof value === "string" ? `'${value}'` : value)
            let columnsToUpdate = ''
            columnKeys.forEach((key:string, indx:number) => {
                columnsToUpdate  += `${key} = ${columnValues[indx]}${indx == columnValues.length - 1 ? '' : ', '}`
            })
            let query = `UPDATE ${table} SET ${columnsToUpdate} WHERE ${conditions}`
            return query;
        },
        innerJoin: (tabel:string, pivot:string, pk:string, fk:string, selection?: string[], where?:object) =>{
            let conditions = createCondtions(where)
            let select = selection ? selection.join() : "*"
            return `SELECT ${select} FROM ${tabel} t INNER JOIN ${pivot} p ON t.${pk} = p.${fk} ${conditions ? `WHERE ${conditions}` : ''}`
        },
        count: (table:string, field:string) => {
            return `SELECT COUNT(${field}) FROM ${table}`
        }
    }
}