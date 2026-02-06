import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'menuItem',
    type: 'object',
    fieldsets: [
        {
            name: 'pricing',
            title: 'Preço',
        },
        {
            name: 'details',
            title: 'Detalhes Adicionais',
            options: { collapsible: true, collapsed: true },
        },
        {
            name: 'availability',
            title: 'Disponibilidade',
            options: { collapsible: true, collapsed: true },
        },
    ],
    fields: [
        defineField({
            name: 'name',
            title: 'Nome',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Descrição',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'image',
            title: 'Foto',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alt text',
                },
            ],
        }),
        defineField({
            name: 'hasVariations',
            title: 'Tem variações?',
            type: 'boolean',
            initialValue: false,
            fieldset: 'pricing',
        }),
        defineField({
            name: 'price',
            title: 'Preço',
            type: 'number',
            validation: (Rule) => Rule.custom((price, context) => {
                const hasVariations = (context.parent as any)?.hasVariations
                if (!hasVariations && !price) {
                    return 'Preço é obrigatório'
                }
                return true
            }),
            hidden: ({ parent }) => !!parent?.hasVariations,
            fieldset: 'pricing',
        }),
        defineField({
            name: 'variations',
            title: 'Variações',
            type: 'array',
            of: [{ type: 'itemVariation' }],
            validation: (Rule) => Rule.custom((variations, context) => {
                const hasVariations = (context.parent as any)?.hasVariations
                if (hasVariations && (!variations || variations.length === 0)) {
                    return 'Adicione ao menos uma variação'
                }
                return true
            }),
            hidden: ({ parent }) => !parent?.hasVariations,
            fieldset: 'pricing',
        }),
        defineField({
            name: 'addons',
            title: 'Adicionais',
            type: 'array',
            of: [{ type: 'addon' }],
            fieldset: 'details',
        }),
        defineField({
            name: 'allergens',
            title: 'Alergênicos',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Glúten', value: 'gluten' },
                    { title: 'Lactose', value: 'lactose' },
                    { title: 'Amendoim', value: 'peanuts' },
                    { title: 'Frutos do Mar', value: 'seafood' },
                    { title: 'Ovos', value: 'eggs' },
                    { title: 'Soja', value: 'soy' },
                    { title: 'Nozes', value: 'nuts' },
                    { title: 'Peixe', value: 'fish' },
                ],
            },
            fieldset: 'details',
        }),
        defineField({
            name: 'isNew',
            title: 'Novo',
            type: 'boolean',
            initialValue: false,
            fieldset: 'details',
        }),
        defineField({
            name: 'isPopular',
            title: 'Popular',
            type: 'boolean',
            initialValue: false,
            fieldset: 'details',
        }),
        defineField({
            name: 'isAvailable',
            title: 'Disponível',
            type: 'boolean',
            initialValue: true,
            fieldset: 'availability',
        }),
        defineField({
            name: 'hasSchedule',
            title: 'Horário limitado',
            type: 'boolean',
            initialValue: false,
            fieldset: 'availability',
        }),
        defineField({
            name: 'availabilitySchedule',
            title: 'Horários de disponibilidade',
            type: 'object',
            fieldset: 'availability',
            hidden: ({ parent }) => !parent?.hasSchedule,
            fields: [
                { name: 'startTime', title: 'Início', type: 'string' },
                { name: 'endTime', title: 'Fim', type: 'string' },
                {
                    name: 'daysOfWeek',
                    title: 'Dias da semana',
                    type: 'array',
                    of: [{ type: 'string' }],
                    options: {
                        list: [
                            { title: 'Segunda', value: 'monday' },
                            { title: 'Terça', value: 'tuesday' },
                            { title: 'Quarta', value: 'wednesday' },
                            { title: 'Quinta', value: 'thursday' },
                            { title: 'Sexta', value: 'friday' },
                            { title: 'Sábado', value: 'saturday' },
                            { title: 'Domingo', value: 'sunday' },
                        ],
                    },
                },
            ],
        }),
    ],
    preview: {
        select: {
            name: 'name',
            price: 'price',
            hasVariations: 'hasVariations',
            image: 'image',
            isAvailable: 'isAvailable',
        },
        prepare({ name, price, hasVariations, image }: Record<string, any>) {
            return {
                title: name || 'Sem nome',
                subtitle: hasVariations
                    ? 'Vários tamanhos/preços'
                    : price
                        ? `R$ ${price.toFixed(2)}`
                        : 'Sem preço',
                media: image,
            }
        },
    },
})