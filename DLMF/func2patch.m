function [] = func2patch(x, t, func)
[x, t] = meshgrid(x, t);
S = surf(x, t, func(x, t));
P = surf2patch(S);

fid = fopen('data.js', 'wb');
[num_face, ~] = size(P.faces);
[num_vertex, ~] = size(P.vertices);
P.faces(:, 5) = P.faces(:, 1);
P.faces = P.faces - 1;

fprintf(fid, '%s', 'var faces = "');
for i=1:num_face - 1
      fprintf(fid, '%s ', strcat(regexprep(mat2str( P.faces(i, 1:3) ), '[[]]', ''), ' -1') );
      fprintf(fid, '%s ', strcat(regexprep(mat2str( P.faces(i, 3:5) ), '[[]]', ''), ' -1') );
end


fprintf(fid, '%s ', strcat(regexprep(mat2str( P.faces(end, 1:3) ), '[[]]', ''), ' -1') );
 fprintf(fid, '%s', regexprep(mat2str( P.faces(end, 3:5) ), '[[]]', '') );
fprintf(fid, '%s\n', '" ');

fprintf(fid, '%s', 'var vertices = " ');
for i=1:num_vertex - 1
      fprintf(fid, ' %s ', strcat(regexprep(mat2str( P.vertices(i, :) ), '[[]]',  ''), ', ') );
end 
fprintf(fid, ' %s ', regexprep(mat2str( P.vertices(end, :) ), '[[]]',  '') );
fprintf(fid, '%s\n', '" ');

xmin = min(P.vertices(:, 1));
xmax = max(P.vertices(:, 1));
ymin = min(P.vertices(:, 2));
ymax = max(P.vertices(:, 2));
zmin = min(P.vertices(:, 3));
zmax = max(P.vertices(:, 3));
[ny, nx] = size(x);
scale = min(2 ./ [ xmax - xmin, ymax - ymin, zmax - zmin ]);
scale = [scale scale scale];
translation = -[ xmax + xmin, ymax + ymin, zmax + zmin ] / 2;
box = [xmin ymin zmin xmax ymin zmin xmax ymax zmin xmin ymax zmin xmin ymin zmax xmax ymin zmax xmax ymax zmax xmin ymax zmax];
cut_x_plane = [ xmin ymin zmin;  xmin ymax zmin;  xmin ymax zmax;  xmin ymin zmax ];
cut_y_plane = [ xmin ymin zmin;  xmax ymin zmin;  xmax ymin zmax;  xmin ymin zmax ];
cut_z_plane = [ xmin ymin zmin;  xmax ymin zmin;  xmax ymax zmin;  xmin ymax zmin ];
  
fprintf(fid, '%s\n', strcat('var xmin = ', num2str(xmin)) );
fprintf(fid, '%s\n', strcat('var xmax = ', num2str(xmax)) );
fprintf(fid, '%s\n', strcat('var ymin = ', num2str(ymin)) );
fprintf(fid, '%s\n', strcat('var ymax = ', num2str(ymax)) );
fprintf(fid, '%s\n', strcat('var zmin = ', num2str(zmin)) );
fprintf(fid, '%s\n', strcat('var zmax = ', num2str(zmax)) );
fprintf(fid, '%s\n', strcat('var nx = ', num2str(nx)) );
fprintf(fid, '%s\n', strcat('var ny = ', num2str(ny)) );
fprintf(fid, '%s\n', strcat('var translation =', regexprep(mat2str( translation ), '[[]]', '"')) );
fprintf(fid, '%s\n', strcat('var box =', regexprep(mat2str( box ), '[[]]', '"')) );
fprintf(fid, '%s\n', strcat('var cut_x_plane =', regexprep(regexprep(mat2str( cut_x_plane ), '[[]]', '"'), ';', ',')) );
fprintf(fid, '%s\n', strcat('var cut_y_plane =', regexprep(regexprep(mat2str( cut_y_plane ), '[[]]', '"'), ';', ',')) );
fprintf(fid, '%s\n', strcat('var cut_z_plane =', regexprep(regexprep(mat2str( cut_z_plane ), '[[]]', '"'), ';', ',')) );
fprintf(fid, '%s\n', strcat('var scale =', regexprep(mat2str( scale ), '[[]]', '"')) );


fclose(fid);
end