export interface IPlanService {
  isPremium(userId: string): Promise<boolean>;
}
