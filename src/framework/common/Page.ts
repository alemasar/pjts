import singleton from "@framework/common/Singleton";

class Page {
  constructor() {
    singleton.subscribe((newValue: any) => {console.log('NEW VALUE INSIDE PAGE', newValue)})
    singleton.value = 'HELLO WORLD'
  }
}

export default Page