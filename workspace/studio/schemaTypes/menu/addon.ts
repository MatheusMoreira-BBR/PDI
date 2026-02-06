import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'addon',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Adicional',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Valor',
            type: 'number',
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            name: 'name',
            price: 'price',
        },
        prepare({ name, price }: Record<string, any>) {
            return {
                title: name,
                subtitle: `+ R$ ${price.toFixed(2)}`,
            }
        },
    },
})