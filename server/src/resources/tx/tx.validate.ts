import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class HexString implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    const regexp = /^[0-9a-fA-F]+$/;
    return regexp.test(id);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Transaction id ($value) is not valid!';
  }
}

export class ValidateTxId {
  @Validate(HexString)
  public id: string;
}
