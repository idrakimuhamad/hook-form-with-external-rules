type FormValues = {
  firstName?: string;
  lastName?: string;
};

export const FakeUmd = {
  salutation: '',
  firstName: '',
  lastName: '',
  remoteRules: {
    ruleForMr: {
      firstName: {
        notEmpty: (value: string) => value.length > 0 || 'Firstname is required',
      },
      lastName: {
        mustBeBravoIfJohnny: (value: string, formValues: FormValues) => {
          const isJohnnyBravo = formValues.firstName === 'johnny' && value === 'bravo';

          return (
            isJohnnyBravo ||
            formValues.firstName !== 'johnny' ||
            'Last name must be bravo if first name is johnny'
          );
        },
        notEmpty: (value: string) => value.length > 0 || 'Lastname is required',
      },
    },
    ruleForMiss: {
      firstName: {
        mustBeSiti: (value: string) => value === 'siti' || 'First name must be siti',
        required: (value: string) => value.length > 0 || 'Firstname is required',
      },
      lastName: {
        notEmpty: (value: string) => value.length > 0 || 'Lastname is required',
      },
    },
  },
  rules: {},
  error: {},

  validate() {
    if (this.firstName === 'siti' && this.lastName.length > 0 && this.lastName !== 'rokiah') {
      this.error = {
        ...this.error,
        lastName: 'Last name must be Rokiah, if first name is Siti',
      };
    } else {
      this.error = {};
    }
  },
  async getUpdatedRule() {
    const rules = await fetch('https://jsonplaceholder.typicode.com/todos/1').then((response) =>
      response.json()
    );

    if (rules) {
      if (this.salutation === 'mr') {
        this.rules = {
          firstName: {
            mustBeJohnny: (value: string) =>
              value.toLowerCase() === 'johnny' || 'First name must be johnny',
            notEmpty: (value: string) => value.length > 0 || 'Firstname is required',
          },
          lastName: {
            mustBeBravoIfJohnny: (value: string, formValues: FormValues) => {
              const isJohnnyBravo =
                formValues.firstName?.toLowerCase() === 'johnny' && value.toLowerCase() === 'bravo';

              return (
                isJohnnyBravo ||
                formValues?.firstName?.toLowerCase() !== 'johnny' ||
                'Last name must be bravo if first name is johnny'
              );
            },
            notEmpty: (value: string) => value.length > 0 || 'Lastname is required',
          },
        };
      } else {
        this.rules = {
          firstName: {
            mustBeSiti: (value: string) =>
              value.toLowerCase() === 'siti' || 'First name must be siti',
            required: (value: string) => value.length > 0 || 'Firstname is required',
          },
          lastName: {
            notEmpty: (value: string) => value.length > 0 || 'Lastname is required',
          },
        };
      }
    }

    return this.rules;
  },
  async updateSalutation(value: string) {
    this.salutation = value;
    await this.getUpdatedRule();
    return this.rules;
  },
  setFirstName(name: string) {
    this.firstName = name;
    this.validate();
  },
  setLastName(name: string) {
    this.lastName = name;
    this.validate();
  },
  getData() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
    };
  },
  getRule() {
    return this.rules;
  },
  getError() {
    return this.error;
  },
};
