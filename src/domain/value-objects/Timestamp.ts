/**
 * Timestamp Value Object
 * Represents a moment in time with validation
 */
export class Timestamp {
  private readonly value: Date;

  constructor(value: Date | string | number) {
    const date = value instanceof Date ? value : new Date(value);
    this.validate(date);
    this.value = date;
  }

  private validate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid timestamp');
    }
  }

  public getValue(): Date {
    return new Date(this.value);
  }

  public isExpired(expirationDuration: number): boolean {
    const now = Date.now();
    const expiration = this.value.getTime() + expirationDuration;
    return now > expiration;
  }

  public isBefore(other: Timestamp): boolean {
    return this.value.getTime() < other.value.getTime();
  }

  public isAfter(other: Timestamp): boolean {
    return this.value.getTime() > other.value.getTime();
  }

  public equals(other: Timestamp): boolean {
    return this.value.getTime() === other.value.getTime();
  }

  public toString(): string {
    return this.value.toISOString();
  }
}
