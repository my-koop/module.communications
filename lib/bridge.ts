import Module = require("./module");

class ModuleBridge implements mykoop.IModuleBridge {
  instance: Module;

  getInstance(): Module {
    return this.instance || (this.instance = new Module());
  }

  onAllModulesInitialized() {
    this.getInstance().init();
  }

  getModule() : mykoop.IModule {
    return this.getInstance();
  }
}

var bridge: mykoop.IModuleBridge = new ModuleBridge();
export = bridge;

