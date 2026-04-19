-- Centralized Security Policies for ROOT Indexer
-- This script enables RLS and defines all access policies in one place.

-- 1. Enable Row Level Security
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_links ENABLE ROW LEVEL SECURITY;

-- 2. Clean up existing policies to avoid conflicts
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 3. Links Policies
-- Users can manage their own links
CREATE POLICY "manage_own_links" ON links
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public can view links that are part of a public collection
CREATE POLICY "view_public_collection_links" ON links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collection_links
      JOIN collections ON collections.id = collection_links.collection_id
      WHERE collection_links.link_id = links.id AND collections.is_public = TRUE
    )
  );

-- 4. Tags Policies
-- Users can manage their own tags
CREATE POLICY "manage_own_tags" ON tags
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Link Tags Policies (Join Table)
-- Users can manage link-tag relationships where they own the link
CREATE POLICY "manage_own_link_tags" ON link_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM links WHERE links.id = link_tags.link_id AND links.user_id = auth.uid())
  );

-- Public view for link-tag relationships if the link is in a public collection
CREATE POLICY "view_public_link_tags" ON link_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM collection_links
      JOIN collections ON collections.id = collection_links.collection_id
      WHERE collection_links.link_id = link_tags.link_id AND collections.is_public = TRUE
    )
  );

-- 6. Collections Policies
-- Users can manage their own collections
CREATE POLICY "manage_own_collections" ON collections
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public can view public collections
CREATE POLICY "view_public_collections" ON collections
  FOR SELECT USING (is_public = TRUE);

-- 7. Collection Links Policies (Join Table)
-- Users can manage links in their own collections
CREATE POLICY "manage_own_collection_links" ON collection_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_links.collection_id AND collections.user_id = auth.uid())
  );

-- Public can view links in public collections
CREATE POLICY "view_public_collection_links_junction" ON collection_links
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_links.collection_id AND collections.is_public = TRUE)
  );
