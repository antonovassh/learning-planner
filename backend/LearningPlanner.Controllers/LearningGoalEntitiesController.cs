// inside GetAll
var goals = await _repository.GetAllAsync(ct); // already domain models
return Ok(goals);