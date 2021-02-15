import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class BlockId implements ValidatorConstraintInterface {
  validate(id: string, args: ValidationArguments) {
    if (Number.isNaN(Number(id))) {
      const regexp = /^[0-9a-fA-F]+$/;
      return regexp.test(id);
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Block id ($value) is not valid!';
  }
}

export class ValidateBlockId {
  @Validate(BlockId)
  public id: string;
}
