import { defineType, defineField } from 'sanity'

export default defineType({
    name: 'menuSection',
    title: 'Seção do Cardápio',
    type: 'document',
    groups: [
        { name: 'omnivore', title: 'Onívoros' },
        { name: 'vegetarian', title: 'Vegetarianos' },
        { name: 'vegan', title: 'Veganos' },
    ],
    fields: [
        defineField({
            name: 'sectionName',
            title: 'Nome',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'order',
            title: 'Ordem',
            type: 'number',
            initialValue: 0,
        }),
        defineField({
            name: 'enableFilter',
            title: 'Separar por tipo de dieta',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'items',
            title: 'Itens',
            type: 'array',
            of: [{ type: 'menuItem' }],
            hidden: ({ document }) => !!document?.enableFilter,
            validation: (Rule) => Rule.custom((items, context) => {
                const enableFilter = (context.document as any)?.enableFilter
                if (!enableFilter && (!items || items.length === 0)) {
                    return 'Adicione ao menos um item'
                }
                return true
            }),
        }),
        defineField({
            name: 'itemsOmnivore',
            title: 'Itens Onívoros',
            type: 'array',
            group: 'omnivore',
            of: [{ type: 'menuItem' }],
            hidden: ({ document }) => !document?.enableFilter,
            validation: (Rule) => Rule.custom((itemsOmnivore, context) => {
                const enableFilter = (context.document as any)?.enableFilter
                if (enableFilter) {
                    const itemsVegetarian = (context.document as any)?.itemsVegetarian || []
                    const itemsVegan = (context.document as any)?.itemsVegan || []
                    const totalItems = (itemsOmnivore?.length || 0) + itemsVegetarian.length + itemsVegan.length
                    if (totalItems === 0) {
                        return 'Adicione ao menos um item em qualquer categoria'
                    }
                }
                return true
            }),
        }),
        defineField({
            name: 'itemsVegetarian',
            title: 'Itens Vegetarianos',
            type: 'array',
            group: 'vegetarian',
            of: [{ type: 'menuItem' }],
            hidden: ({ document }) => !document?.enableFilter,
        }),
        defineField({
            name: 'itemsVegan',
            title: 'Itens Veganos',
            type: 'array',
            group: 'vegan',
            of: [{ type: 'menuItem' }],
            hidden: ({ document }) => !document?.enableFilter,
        }),
        defineField({
            name: 'isActive',
            title: 'Visível',
            type: 'boolean',
            description: 'Desmarque para ocultar do cardápio',
            initialValue: true,
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'sectionName',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
    ],
    orderings: [
        {
            title: 'Ordem',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Nome (A-Z)',
            name: 'nameAsc',
            by: [{ field: 'sectionName', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'sectionName',
            order: 'order',
            isActive: 'isActive',
        },
        prepare({ title, order, isActive }: Record<string, any>) {
            return {
                title: title || 'Sem nome',
                subtitle: `Ordem: ${order ?? 0}${!isActive ? ' • Oculta' : ''}`,
            }
        },
    },
})
