const mergeObj = (master: any, merge: any) => {
  const masterKeys = Object.keys(master)
  const mergeKeys = Object.keys(merge)
  const obj: Record<string, any> = {...master}
  mergeKeys.forEach((mk) => {
    if (masterKeys.includes(mk) === true) {
      if (typeof master[mk] === 'object' && typeof merge[mk] === 'object') {
        obj[mk] = mergeObj(master[mk], merge[mk])
      } else {
        obj[mk] = {...master[mk], ...merge[mk]}
      }
    } else {
      obj[mk] = merge[mk]
    }
  })
  return obj
}

class CatData {
  static #instance: CatData;
  private _data:  Map<string, any>;
  private _commits: Map<string, any>;

  private constructor() {
    this._data = new Map<string, any>()
    this._commits = new Map<string, any[]>()
  }

  public static get instance(): CatData {
      if (!CatData.#instance) {
          CatData.#instance = new CatData();
      }

      return CatData.#instance;
  }

  pull(id: string) {
    return this._data.get(id)
  }
  commit(id:string, commit: any) {
    const commitsById = this._commits.get(id)
    let arrayCommits: any[] = []
    if (commitsById !== null) {
      arrayCommits = commitsById
    }
    arrayCommits.push(commit)
    this._commits.set(id, arrayCommits)
  }
  push(id: string) {
    const commits = this._commits.get(id)
    commits.forEach((c: any) => {
      const oldData = this._data.get(id)
      if (oldData !== null) {
        this._data.set(id, mergeObj(oldData, c))
      } else {
        this._data.set(id, c)
      }
    })
  }
}

export default CatData
