import CommentGroup from 'src/views/CommentGroup/CommentGroup' 
import * as common from 'test/specs/commonTests' 
describe.only('CommentGroup', () => { 
  common.isConformant(CommentGroup) 
  common.rendersChildren(CommentGroup) 
})
