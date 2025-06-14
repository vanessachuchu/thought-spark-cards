
import { useState, useEffect } from 'react';
import { useThoughts } from './useThoughts';

export interface TagInfo {
  name: string;
  count: number;
  thoughtIds: string[];
}

export function useTags() {
  const { thoughts } = useThoughts();
  const [tags, setTags] = useState<TagInfo[]>([]);

  useEffect(() => {
    const tagMap = new Map<string, { count: number; thoughtIds: string[] }>();
    
    thoughts.forEach(thought => {
      thought.tags.forEach(tag => {
        if (tagMap.has(tag)) {
          const existing = tagMap.get(tag)!;
          tagMap.set(tag, {
            count: existing.count + 1,
            thoughtIds: [...existing.thoughtIds, thought.id]
          });
        } else {
          tagMap.set(tag, {
            count: 1,
            thoughtIds: [thought.id]
          });
        }
      });
    });

    const tagList = Array.from(tagMap.entries()).map(([name, info]) => ({
      name,
      count: info.count,
      thoughtIds: info.thoughtIds
    })).sort((a, b) => b.count - a.count);

    setTags(tagList);
  }, [thoughts]);

  return { tags };
}
