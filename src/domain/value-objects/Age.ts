/**
 * Age Value Object
 * Represents an age in years with validation
 */
export class Age {
  private readonly value: number;

  constructor(value: number) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Age must be an integer');
    }
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    if (value > 150) {
      throw new Error('Age cannot exceed 150 years');
    }
  }

  public getValue(): number {
    return this.value;
  }

  public isAdult(legalAge: number = 18): boolean {
    return this.value >= legalAge;
  }

  public equals(other: Age): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
