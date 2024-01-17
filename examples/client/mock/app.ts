import { Context } from 'koa'

export default {
  'GET /mock/hello': {
    text: 'hello emii',
  },
  'POST /mock/list': (ctx: Context) => {
    const dbData = [
      {
        id: 1,
        title: 'Title 1',
      },
      {
        id: 2,
        title: 'Title 2',
      },
      {
        id: 3,
        title: 'Title 3',
      },
      {
        id: 4,
        title: 'Title 4',
      },
      {
        id: 5,
        title: 'Title 5',
      },
    ]

    const postData = ctx.request.body

    const { pageSize, current } = postData

    ctx.body = {
      total: dbData.length,
      data: dbData.slice(current, current + pageSize),
    }
  },
}
