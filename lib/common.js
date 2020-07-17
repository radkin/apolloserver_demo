module.exports = class TestCommon {
  constructor() {
    this.scopes = ['floyd', 'knox', 'clay', 'wells', 'henry', 'bucks', 'chase', 'bath', 'york', 'kent', 'bay', 'polk', 'clark', 'liberty', 'carson', 'colfax', 'halifax', 'hyde', 'clinton', 'mercer', 'adams', 'ross', 'wood', 'coal', 'perry'];
    this.scopesRange = this.scopes.length - 2;
    this.names = ['bath', 'garden', 'kitchen', 'appliances', 'cooking', 'utility', 'publications', 'wholesale', 'all', 'housewares'];
    this.locations = ['NYC', 'SFO', 'LAX', 'JFK', 'RDU', 'RAP'];
    this.totalEnvs = this.locations.length - 1;
    this.namesRange = this.names.length - 2;
    this.customers = [];
    this.versions = [];
    this.products = [];
    this.totalApps = 0;
    this.releaseBase = 1200;
    this.generateCustomerNames();
  }

  generateCustomerNames() {
    this.scopes.forEach((scope) => {
      this.names.forEach((name) => {
        const n = `${scope}-${name}`;
        if (this.customers.indexOf(n) === -1) {
          this.customers.push({ group: 'priced', name: `${scope}-${name}` });
        }
      });
    });
    this.names.forEach((name) => {
      const n = `nonPriced-${name}`;
      if (this.customers.indexOf(n) === -1) {
        this.customers.push( { group: 'consignment', name: n });
      }
    });

    this.totalApps = this.customers.length - 2;
  }
  getRandomLocation() {
    const index = Math.floor(Math.random() * this.totalEnvs);
    const env = this.locations[index];
    return env;
  }

  getAllCustomers() {
    return this.customers;
  }

  getRandomSemVer() {
    return `${Math.ceil(Math.random() * 99)}.${Math.ceil(Math.random() * 99)}.${Math.ceil(Math.random() * 99)}`;
  }

  getCustomerName() {
    const index = Math.round(Math.random() * this.totalApps);
    return this.customers[index].name;
  }
}
