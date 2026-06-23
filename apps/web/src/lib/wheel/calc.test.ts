import { describe, it, expect } from 'vitest';
import { calcNatal, famOfPos, parsePos, relate } from './calc';

describe('calcNatal 金標案例（與 Python 引擎對拍）', () => {
  it('10/15 → 群鴨飛遷之月（渡鴉）／天秤／西方／蝴蝶', () => {
    const n = calcNatal(10, 15)!;
    expect(n.id).toBe(22);
    expect(n.fullmonth).toBe('群鴨飛遷之月（渡鴉）');
    expect(n.zod).toBe('天秤');
    expect(n.dir).toBe('西');
    expect(n.fam).toBe('蝴蝶');
    expect(n.famId).toBe(8);
    expect(n.dirId).toBe(12);
  });

  it('12/25 → 大地復原之月／北／海龜（跨年區間）', () => {
    const n = calcNatal(12, 25)!;
    expect(n.id).toBe(13);
    expect(n.dir).toBe('北');
    expect(n.fam).toBe('海龜');
  });

  it('1/19 跨年邊界 → 大地復原之月', () => {
    expect(calcNatal(1, 19)!.id).toBe(13);
  });

  it('1/20 → 休眠淨化之月', () => {
    expect(calcNatal(1, 20)!.id).toBe(14);
  });

  it('2/29 閏年 → 強風之月（休眠淨化止於 2/18）', () => {
    expect(calcNatal(2, 29)!.id).toBe(15);
  });
});

describe('家族對應與落點解析', () => {
  it('famOfPos：月亮→家族，5–8→自身', () => {
    expect(famOfPos(22)).toBe('蝴蝶');
    expect(famOfPos(7)).toBe('雷鳥');
    expect(famOfPos(1)).toBeNull();
  });

  it('parsePos：多分隔符、過濾無效', () => {
    expect(parsePos('18,23、32 9')).toEqual([18, 23, 32, 9]);
    expect(parsePos('0,37,abc,5')).toEqual([5]);
  });
});

describe('相合判定', () => {
  it('同族', () => expect(relate('蝴蝶', '蝴蝶').type).toBe('同族'));
  it('雙合（對立）火↔風', () => expect(relate('雷鳥', '蝴蝶').type).toBe('雙合（對立）'));
  it('雙合（對立）土↔水', () => expect(relate('海龜', '青蛙').type).toBe('雙合（對立）'));
  it('半合（相鄰）', () => expect(relate('雷鳥', '海龜').type).toBe('半合（相鄰）'));
});
