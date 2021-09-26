import { Account } from 'src/accounts/schemas/account.schema';

export const accountStub = (): Account => {
  return {
    discordId: '227833554258624523',
    summonerName: 'ItsNexty',
    verified: true,
    uuid: '',
    playerUUID: '',
    summonerId: '',
  };
};
