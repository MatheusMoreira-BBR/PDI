import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'itemVariation',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Nome',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'price',
            title: 'Preço',
            type: 'number',
            validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
            name: 'serves',
            title: 'Serve (pessoas)',
            type: 'number',
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
                subtitle: price ? `R$ ${price.toFixed(2)}` : 'Sem preço',
            }
        },
    },
})