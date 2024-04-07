import moment from 'moment'

// 格式化时间
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const tableFormateDate = (row: any, column: any, cellValue: any) => {
  return moment(cellValue).format('YYYY-MM-DD')
}
