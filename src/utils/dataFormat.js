/**
 * @param {源数据} source
 * @param {关键字段} id
 * @param {更新字段名} fileName
 * @param {更新值} fileValue
 */
export function UpdateField (source, id, fileName, fileValue) {
  if (id === 0) {
    source.forEach(item => {
      item[fileName] = fileValue
    })
  } else {
    source.forEach(item => {
      if (item.Id === id || item.key === id) {
        item[fileName] = fileValue
      }
    })
  }
}
